import {
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Controller,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { TwitterApi } from 'twitter-api-v2';
import { TwitterApi as TwitterApiType } from 'twitter-api-v2/dist/client';
import { TwitterService } from './twitter.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { FileInterceptor } from '@nestjs/platform-express';

// Instantiate with desired auth type (here's Bearer v2 auth)

const appKey = 'iLoClFZnSSgFOKzCYmmel0Lvo';
const appSecret = 'SvRVOWkKdiUjwZwixmq3zfeYWzBOj4qc9bQ0EMRg1E3tksPPSM';
let accessToken = '1369638430259482625-ANnQDEXYz8aH0d4ENPGw9e6DcQJS8T';
let accessSecret = 'A5L2R6RjLiHmaWPMVO85ZBiG92eqlJFxnCCt1yJ99jJ3B';

const clientId = 'R3htUzdJY2lHOWcyNkFycHdGaWY6MTpjaQ';
const clientSecret = 'mV09gRVkByq_xMuT2Z_hz9Azod3ACZuB_JJZ5F23s8ZsLz7xiL';
let codeVerifier = '';
let loggedClient: TwitterApiType;

const twitterClient = new TwitterApi({
  // appKey: appKey,
  // appSecret: appSecret,
  // accessToken: accessToken,
  // accessSecret: accessSecret,
  clientId,
  clientSecret,
});

// client ID - R3htUzdJY2lHOWcyNkFycHdGaWY6MTpjaQ
// client secret - mV09gRVkByq_xMuT2Z_hz9Azod3ACZuB_JJZ5F23s8ZsLz7xiL
// access token - 1369638430259482625-ANnQDEXYz8aH0d4ENPGw9e6DcQJS8T
// access secret: A5L2R6RjLiHmaWPMVO85ZBiG92eqlJFxnCCt1yJ99jJ3B
// api key - iLoClFZnSSgFOKzCYmmel0Lvo
// api key secret - SvRVOWkKdiUjwZwixmq3zfeYWzBOj4qc9bQ0EMRg1E3tksPPSM
// const readWriteClient = twitterClient.readWrite;

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Get()
  getAll() {
    return '';
  }

  @Post('login')
  async login() {
    // OAuth v1
    // const data = await twitterClient.generateAuthLink('oob', {
    //   authAccessType: 'write',
    // });

    // OAuth v2
    const data = await twitterClient.generateOAuth2AuthLink(
      'https://green.soundcamps.org/',
      {
        scope: [
          'tweet.read',
          'users.read',
          'offline.access',
          'tweet.write',
          'tweet.moderate.write',
        ],
      },
    );
    // accessToken = data.oauth_token;
    // accessSecret = data.oauth_token_secret;
    codeVerifier = data.codeVerifier;
    return {
      authLink: data.url,
    };
  }

  @Post('verification')
  async confirm(@Body() body: { code: string }) {
    const { code } = body;
    // const twitterClient = new TwitterApi({
    //   appKey: appKey,
    //   appSecret: appSecret,
    //   accessToken: accessToken,
    //   accessSecret: accessSecret,
    // });
    console.log('code: ', code);
    const data = await twitterClient.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: 'https://green.soundcamps.org/',
    });
    loggedClient = data.client;
    return {
      response: data,
    };
  }

  @Post('upload-media')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadMediaDto: UploadMediaDto,
  ) {
    console.log('try upload media', file, uploadMediaDto.message);
    console.log('twitter cliend created');
    const data = await loggedClient.v1.uploadMedia(file.buffer, {
      mimeType: file.mimetype,
    });
    console.log('data: ', data);
    const result = await loggedClient.v2.tweet(uploadMediaDto.message, {
      media: {
        media_ids: [data],
      },
    });
    return {
      payload: uploadMediaDto,
      file,
      data,
      result,
    };
  }
}
