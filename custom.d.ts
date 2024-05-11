// declare namespace Express {

//     export interface Request {
//       session: Session & { userId: number | string }; // Make userId non-optional
//     } 
//  }


declare namespace Express{
  interface Request {
    session: Session & { userId: number | string }; // Make userId non-optional
  }
}