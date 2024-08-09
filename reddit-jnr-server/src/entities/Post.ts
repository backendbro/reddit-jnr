import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity{

  @Field()
  @PrimaryGeneratedColumn()
  id!: number; 

  @Field()
  @Column()
  title!:String

  @Field()
  @Column()
  text!:String

  @Field()
  @Column({type:"int", default:0}) 
  points!:number

  @Field() 
  @Column() 
  creatorId: number; 

  @ManyToOne(() => User, (user) => user.posts)  
  creator: User 


  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date
}