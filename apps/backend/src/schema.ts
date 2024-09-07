import { ObjectType, Field, ID, Resolver, Query } from "type-graphql";
import { User } from "@/packages/types";

@ObjectType()
class UserType implements User {
  @Field(() => ID)
  id!: number;

  @Field()
  email!: string;

  @Field({ nullable: true })
  name?: string | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@Resolver(UserType)
class UserResolver {
  @Query(() => [UserType])
  async users(): Promise<UserType[]> {
    // Implement user fetching logic using Prisma
    return [];
  }
}

export const schema = [UserResolver];