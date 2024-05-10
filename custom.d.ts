declare namespace Express {
    
   
        // export interface Session {
        //   userId?: number | string; // Assuming user.id is a number or string
        // }
      
        export interface Request {
          session: Session & { userId: number | string }; // Make userId non-optional
        }
      
 }