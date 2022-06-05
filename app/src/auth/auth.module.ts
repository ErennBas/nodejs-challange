import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { JwtAuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService, JwtAuthGuard],
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret:
          'PeShVmYq3s6v9y$B&E)H@McQfTjWnZr4u7w!z%C*F-JaNdRgUkXp2s5v8y/A?D(G',
        signOptions: { expiresIn: '50000s' },
      }),
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
