export * from './pipe.schema';

export interface Session {
  id: number;
  uuid: string;
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  image?: string | null;
}
declare module 'koa' {
  interface Context<ResponseBodyT = unknown> {
    context: Session;
    body: ResponseBodyT;
  }
}
