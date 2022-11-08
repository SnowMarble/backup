import type { Request } from "express";

type Body<T> = Request<any, any, T>

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
}>


export type CreateStory = Body<{
  image: string
  albumId: number
  description: string
}>
