import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    let connectionString = process.env.DATABASE_URL;

    // Log connection string presence (masked for safety)
    if (connectionString) {
      console.log(`Database connection string detected: ${connectionString.substring(0, 15)}...`);
      // Sanitize connection string for pg driver
      connectionString = connectionString.replace(/([?&])sslmode=[^&]*/, '$1sslmode=require');
    } else {
      console.error('DATABASE_URL is NOT defined in environment variables!');
    }

    // Explicitly allow self-signed certs (Supabase/Render common issue)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    super({ adapter: new PrismaPg(pool) });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Successfully connected to database');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }
}