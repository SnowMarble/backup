import type { Request } from "express";

type Body<T> = Request<any, any, T>

export type LoginBody = Body<{
  idToken: string;
}>

export type OnboardingNameBody = Body<{
  name: string;
}>

export type OnboardingFamilyBody = Body<{
  name: string;
}>

export type OnboardingFamilyCodeBody = Body<{
  familyCode: string;
}>
