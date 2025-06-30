export const imageService = {
  async getImage(): Promise<string | null> {
    try {
      const result = await window.api.selectImage()
      return result
    } catch (error) {
      return null
    }
  },

  async saveImages(data: {
    base64: string
    pnombre: string
    papellido: string
    cedula: string
    tipo: string
  }): Promise<{ success: boolean; path: string }> {
    try {
      const result = await window.api.saveImage(data)
      return result
    } catch (error) {
      return { success: false, path: '' }
    }
  }
}
