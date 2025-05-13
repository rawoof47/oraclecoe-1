import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: '', // ⛔ Replace with your actual DB password
      database: 'oracle_job_portal',
      autoLoadEntities: true,
      synchronize: false, // Set to true ONLY in development
    }),
    UserModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
