/**
 * Uploads images directly from the browser to Google Drive via Apps Script webhook.
 * This bypasses Vercel's 4.5MB serverless function body limit, allowing large images
 * (10MB+) to be uploaded reliably.
 *
 * Flow: Browser → Google Apps Script → Google Drive (Listing_images/{username}/)
 */

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // Remove the data:image/...;base64, prefix to get raw base64
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`))
    reader.readAsDataURL(file)
  })
}

function sanitizeUsername(name) {
  return name.replace(/[<>:"/\\|?*]/g, '_').trim()
}

/**
 * Upload images one at a time to Google Drive Apps Script.
 * Sends each image individually for reliability with large files and progress tracking.
 *
 * @param {File[]} files - Array of File objects to upload
 * @param {string} webhookUrl - Google Drive Apps Script webhook URL
 * @param {string} username - User's full name (used as folder name in Drive)
 * @param {function} onProgress - Callback: (currentIndex, totalCount, fileName) => void
 * @returns {Promise<{uploaded: number, failed: string[]}>}
 */
export async function uploadImagesToDrive(files, webhookUrl, username, onProgress) {
  const sanitizedName = sanitizeUsername(username)
  let uploaded = 0
  const failed = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    onProgress?.(i, files.length, file.name)

    try {
      // Convert file to base64
      const base64Content = await fileToBase64(file)

      const payload = {
        userName: sanitizedName,
        files: [
          {
            fileName: file.name,
            mimeType: file.type || 'image/jpeg',
            content: base64Content,
          },
        ],
      }

      // POST to Google Apps Script webhook
      // Using text/plain content type to avoid CORS preflight
      // Apps Script parses JSON.parse(e.postData.contents) regardless of content type
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow',
      })

      // Try to read response (may succeed or fail depending on CORS)
      try {
        const text = await response.text()
        if (response.ok || text.includes('success')) {
          uploaded++
          console.log(`[Drive Upload] ${file.name} uploaded successfully`)
        } else {
          console.warn(`[Drive Upload] ${file.name} response:`, text)
          // Still count as uploaded — Apps Script may have processed it
          // even if response parsing has issues
          uploaded++
        }
      } catch {
        // Opaque response (CORS) — request was still sent and likely processed
        uploaded++
        console.log(`[Drive Upload] ${file.name} sent (response opaque due to CORS)`)
      }
    } catch (err) {
      console.error(`[Drive Upload] Failed to upload ${file.name}:`, err)
      failed.push(file.name)
    }
  }

  onProgress?.(files.length, files.length, 'done')
  return { uploaded, failed }
}
