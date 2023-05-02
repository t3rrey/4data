/**
 * 
 * @param data  the data to be validated
 * @param headings  the headings to be validated against
 * @returns true if the data headings match the headings provided
 */


export const validateParsedDataHeadings = (data: any[], headings: string[]): boolean => { 
    if (
      !data[0] ||
      data[0].length !== headings.length ||
      !data[0].every(
        (value: string, index: number) => value === headings[index]
      )
    ) {
      return false;
    }

    return true;
  }