import { BytesPipe } from './bytes.pipe';

describe('BytesPipe', () => {
  let pipe: BytesPipe;

  beforeEach(() => {
    pipe = new BytesPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format bytes correctly', () => {
    expect(pipe.transform(0)).toBe('0 Bytes');
    expect(pipe.transform(1024)).toBe('1 KB');
    expect(pipe.transform(1048576)).toBe('1 MB');
    expect(pipe.transform(1073741824)).toBe('1 GB');
  });

  it('should handle custom decimals', () => {
    expect(pipe.transform(1536, 3)).toBe('1.5 KB');
    expect(pipe.transform(1572864, 1)).toBe('1.5 MB');
  });
});