//
//  Utilties.m
//  56GO
//
//  Created by Dac Bui on 7/26/23.
//

#import "Utilties.h"

@implementation Utilties
+(NSString*)googleServicesFile{
  NSString *googleServicesFile = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"GOOGLE_SERVICE_FILE"];
  return [[NSBundle mainBundle] pathForResource:googleServicesFile ofType:@".plist"];
}
@end
