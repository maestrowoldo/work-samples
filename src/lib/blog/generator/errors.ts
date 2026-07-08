export class BlogGeneratorError extends Error {
  isFatal: boolean;

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "BlogGeneratorError";
    this.isFatal = false;
  }
}

export class AiRateLimitError extends BlogGeneratorError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AiRateLimitError";
    this.isFatal = true;
  }
}
