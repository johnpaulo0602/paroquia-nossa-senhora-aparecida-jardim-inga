import sharp from 'sharp'

/**
 * Tiny blurred preview for `next/image` (`placeholder="blur"`). 16px wide webp, ~300 bytes as
 * a data URL, so it can be stored on the media document and shipped inline with the page.
 */
export async function makeBlurDataURL(input: Buffer | string): Promise<string | null> {
  try {
    const buffer = await sharp(input).resize(16, 16, { fit: 'inside' }).webp({ quality: 40 }).toBuffer()
    return `data:image/webp;base64,${buffer.toString('base64')}`
  } catch {
    // Unsupported or corrupt file: the image simply loads without a placeholder.
    return null
  }
}
