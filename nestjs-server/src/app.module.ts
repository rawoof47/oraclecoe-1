// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// ✅ Correct Module Import
import { UsersModule } from './users/users.module';

import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { ApiAccessTokensModule } from './api-access-tokens/api-access-tokens.module';
import { ApplicationsModule } from './applications/applications.module';
import { BadgesModule } from './badges/badges.module';
import { CandidateProfilesModule } from './candidate-profiles/candidate-profiles.module';
import { CandidateSkillsModule } from './candidate-skills/candidate-skills.module';
import { CategoriesModule } from './categories/categories.module';
import { ContentModerationModule } from './content-moderation/content-moderation.module';
import { JobPostsModule } from './job-posts/job-posts.module';
import { JobShortlistsModule } from './job-shortlists/job-shortlists.module';
import { OracleModulesModule } from './oracle-modules/oracle-modules.module';
import { RecruiterTeamsModule } from './recruiter-teams/recruiter-teams.module';
import { ReferralsModule } from './referrals/referrals.module';
import { RewardPointsModule } from './reward-points/reward-points.module';
import { RolesModule } from './roles/roles.module';
import { StatusesModule } from './statuses/statuses.module';
import { StatusCategoriesModule } from './status-categories/status-categories.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UserBadgesModule } from './user-badges/user-badges.module';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { SkillsModule } from './skills/skills.module';
import { CertificationsModule } from './certifications/certifications.module';
import { JobPostCertificationsModule } from './job-post-certification/job-post-certifications.module';
import { CandidateCertificationsModule } from './candidate_certifications/candidate_certifications.module';
import { RecruiterProfileModule } from './recruiter-profile/recruiter-profile.module';
import { DegreeModule } from './degree/degree.module';
import { CandidateDegreesModule } from './candidate_degrees/candidate_degrees.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME','yardglobal'),
        password: configService.get<string>('DB_PASSWORD', 'Yard@^78'),
        database: configService.get<string>('DB_NAME', 'oracle_job_portal'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    UsersModule, // ✅ Correct name here

    ActivityLogsModule,
    AdminUsersModule,
    ApiAccessTokensModule,
    ApplicationsModule,
    BadgesModule,
    CandidateProfilesModule,
    CandidateSkillsModule,
    CategoriesModule,
    ContentModerationModule,
    JobPostsModule,
    JobShortlistsModule,
    OracleModulesModule,
    RecruiterTeamsModule,
    ReferralsModule,
    RewardPointsModule,
    RolesModule,
    StatusesModule,
    StatusCategoriesModule,
    SubscriptionsModule,
    UserBadgesModule,
    AuthModule,
    JobsModule,
    SkillsModule,
    CertificationsModule,
    JobPostCertificationsModule,
    CandidateCertificationsModule,
    RecruiterProfileModule,
    DegreeModule,
    CandidateDegreesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
