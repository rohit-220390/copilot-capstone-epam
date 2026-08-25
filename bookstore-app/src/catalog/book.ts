export type BookCategory = 'fiction' | 'non-fiction';
export type BookFormat = 'hardcover' | 'paperback' | 'ebook' | 'audiobook';
export type BookLanguage = 'english' | 'spanish' | 'french' | 'german';

export interface Book {
  id: string;
  title: string;
  category: BookCategory;
  format: BookFormat;
  language: BookLanguage;
  /** ISO 8601 date string. */
  publicationDate: string;
  /** 0-5 average customer rating. */
  averageRating: number;
}
