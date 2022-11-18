import type { Request } from "express";

export type Body<T, U = any> = Request<any, any, T, U>

export type CreateCategoryType = Body<{
  name: string
  familyId: number
}>

export type CreateAlbum = Body<{
  name: string
  eventDate: string
  categoryId: number
  description: string
  thumbnail?: string
  revealsAt?: string
}>


export type CreateStory = Body<{
  image: string
  albumId: number
  description: string
}>
