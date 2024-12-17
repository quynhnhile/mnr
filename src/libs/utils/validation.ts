export class Validation {
  async checkMatchContainerNo(containerNo: string): Promise<boolean> {
    if (!containerNo.match(/^[A-Z]{4}[0-9]{7}$/)) {
      return false;
    }
    return true;
  }
}
