import { Constants } from 'src/app/shared/constants';

export class StringExtension {

  public static ExtractGuid(str: string): string {
    const reg_guid = Constants.Regex.Guid;
    return reg_guid.test(str) ? reg_guid.exec(str)[0] : null;
  }

}
