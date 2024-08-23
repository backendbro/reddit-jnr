import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";
import { Updoot } from "./Updoot";

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

  @Field() 
  @ManyToOne(() => User, (user) => user.posts)  
  creator: User 

  @OneToMany(() => Updoot, (updoot) => updoot.post) 
  updoots: Updoot[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date
}