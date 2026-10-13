import { BadRequestException, Body, Controller, Get, Post } from "@nestjs/common";
import { CreateUser } from "@flow/shared";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() body: unknown) {
    const parsed = CreateUser.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());
    return this.usersService.create(parsed.data);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
