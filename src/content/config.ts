import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Review collection schema
const reviewsCollection = defineCollection({
  loader: glob({ pattern: '**/reviews/*.md', base: './src/content' }),
  schema: z.object({
    // 语言标识
    lang: z.enum(['en', 'zh']).default('en'),
    
    // 基础信息
    title: z.string(),
    description: z.string(),
    excerpt: z.string().optional(),
    
    // 产品信息
    productName: z.string(),
    productCategory: z.string(),
    productBrand: z.string().optional(),
    
    // 评分
    rating: z.number().min(0).max(5),
    ratingCount: z.number().int().positive().optional(),
    helpfulPercentage: z.number().min(0).max(100).optional(),
    
    // 价格
    price: z.number().positive(),
    priceCurrency: z.string().default('USD'),
    priceHistory: z.array(z.object({
      date: z.string(),
      price: z.number(),
      retailer: z.string(),
    })).optional(),
    
    // 特性
    keyFeatures: z.array(z.string()),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    specifications: z.record(z.string(), z.string()).optional(),
    
    // 元数据
    author: z.string(),
    publishDate: z.string().transform((str) => new Date(str)),
    updateDate: z.string().transform((str) => new Date(str)).optional(),
    readTime: z.number().int().positive(),
    
    // SEO
    slug: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    editorPick: z.boolean().default(false),
    topPick: z.boolean().default(false),
    
    // 媒体
    coverImage: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    videoReview: z.string().optional(),
    
    // 相关产品
    relatedProducts: z.array(z.string()).optional(),
    alternativeProducts: z.array(z.string()).optional(),
    
    // 零售商
    retailers: z.array(z.object({
      name: z.string(),
      url: z.string().url(),
      price: z.number(),
      inStock: z.boolean().default(true),
    })).optional(),
  }),
});

// Guide collection schema
const guidesCollection = defineCollection({
  loader: glob({ pattern: '**/guides/*.md', base: './src/content' }),
  schema: z.object({
    lang: z.enum(['en', 'zh']).default('en'),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    author: z.string(),
    publishDate: z.string().transform((str) => new Date(str)),
    readTime: z.number().int().positive(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    coverImage: z.string().optional(),
  }),
});

// Category collection schema
const categoriesCollection = defineCollection({
  loader: glob({ pattern: '**/categories/*.json', base: './src/content' }),
  schema: z.object({
    lang: z.enum(['en', 'zh']).default('en'),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    parentCategory: z.string().optional(),
    subcategories: z.array(z.string()).default([]),
    productCount: z.number().int().default(0),
    reviewCount: z.number().int().default(0),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  'reviews': reviewsCollection,
  'guides': guidesCollection,
  'categories': categoriesCollection,
};