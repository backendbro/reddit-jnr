import { DataSource } from "typeorm"
import path from "path"


const AppDataSource = new DataSource({
    type:"postgres", 
    database:'lilreddit3', 
    username:"postgres", 
    password:'islam123', 
    logging:true, 
    synchronize:false, 
    migrations:[path.join(__dirname, "./migrations/*")],
    entities: [path.join(__dirname, "./entities/*")]   
}) 


module.exports = {
    datasource: AppDataSource
  }