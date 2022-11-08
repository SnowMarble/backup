export const defaultImages: string[] = [
  "https://i.ibb.co/ynd74vF/d010771f19a47c6d1935bfb2c50d83e8.jpg",
  "https://i.ibb.co/2hwkFz1/cd4f3e3bda0df0d5bc0f75d7a4e81290.jpg",
]

export const randomIndex = (): number => {
  return Math.floor(Math.random() * defaultImages.length)
}
