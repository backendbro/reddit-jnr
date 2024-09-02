import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { Field, ObjectType, Int } from "type-graphql";
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

  @Field(() => Int, {nullable: true}) 
  voteStatus: number | null;

  @Field() 
  @Column() 
  creatorId: number; 

  @Field(() => User) 
  @ManyToOne(() => User, (user) => user.posts)  
  creator: User 

  @OneToMany(() => Updoot, (updoots) => updoots.post) 
  updoots: Updoot[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date
}