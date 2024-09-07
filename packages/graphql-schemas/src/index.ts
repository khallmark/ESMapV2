import { ObjectType, Field, ID, Resolver, Query, Float, Arg, Int } from "type-graphql";
import { User, Call, MapCall, Source } from "@esmapv3/types";

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

@ObjectType()
class CallType implements Call {
  @Field(() => ID)
  id!: number;

  @Field()
  source!: string;

  @Field()
  category!: string;

  @Field()
  description!: string;

  @Field()
  location!: string;

  @Field()
  callTime!: string;

  @Field({ nullable: true })
  closed!: string | null;

  @Field(() => Float)
  lat!: number;

  @Field(() => Float)
  lng!: number;
}

@ObjectType()
class MapCallType implements MapCall {
  @Field(() => ID)
  id!: number;

  @Field(() => Float)
  lat!: number;

  @Field(() => Float)
  lng!: number;

  @Field()
  tooltip!: string;

  @Field()
  category!: string;
}

@ObjectType()
class SourceType implements Source {
  @Field(() => ID)
  id!: number;

  @Field()
  tag!: string;

  @Field()
  url!: string;

  @Field()
  parser!: string;

  @Field()
  updateTime!: string;
}

@Resolver()
export class Resolvers {
  @Query(() => [UserType])
  async users(): Promise<UserType[]> {
    // This will be implemented in the backend
    return [];
  }

  @Query(() => [CallType])
  async recentCalls(@Arg("limit", () => Int, { nullable: true }) limit?: number): Promise<CallType[]> {
    // This will be implemented in the backend
    return [];
  }

  @Query(() => [MapCallType])
  async mapCalls(): Promise<MapCallType[]> {
    // This will be implemented in the backend
    return [];
  }

  @Query(() => SourceType, { nullable: true })
  async sourceByTag(@Arg("tag") tag: string): Promise<SourceType | null> {
    // This will be implemented in the backend
    return null;
  }
}

export const schema = [Resolvers];