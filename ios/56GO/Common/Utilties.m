//
//  Utilties.m
//  Vone
//
//  Created by Dac Bui on 08/25/23.
//  Copyright © 2023 Vone. All rights reserved.
//


#import "Utilties.h"

@implementation Utilties
+(NSString*)googleServicesFile{
  NSString *googleServicesFile = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"GOOGLE_SERVICE_FILE"];
  return [[NSBundle mainBundle] pathForResource:googleServicesFile ofType:@".plist"];
}
@end
