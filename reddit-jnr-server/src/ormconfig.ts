import { DataSource } from "typeorm"
import path from "path"


const AppDataSource = new DataSource({
    type:"postgres", 
    database:process.env.databaseName, 
    username:process.env.databaseUsername, 
    password:process.env.databasePassword, 
    logging:true, 
    synchronize:false, 
    migrations:[path.join(__dirname, "./migrations/*")],
    entities: [path.join(__dirname, "./entities/*")]   
}) 


module.exports = {
    datasource: AppDataSource
  }