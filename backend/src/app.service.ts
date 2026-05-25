import { Injectable } from '@nestjs/common';
import { CategoriesService } from './categories/categories.service';
import { PostsService } from './posts/posts.service';
import { CarouselService } from './carousel/carousel.service';

@Injectable()
export class AppService {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly postsService: PostsService,
    private readonly carouselService: CarouselService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getHomepageData() {
    const [categories, posts, categoriesWithPosts, yojnaData, carouselItems] =
      await Promise.all([
        this.categoriesService.findAll(),
        this.postsService.findLatestByCategory('Latest Jobs', 8),
        this.postsService.findSummaryByCategories(
          15,
          'Latest Jobs,Yojna,Results,Admit cards,Documents,Answer Keys',
        ),
        this.categoriesService.findBySlugWithPosts('yojna', 1, 12),
        this.carouselService.findAll(true),
      ]);

    return {
      categories,
      posts,
      categoriesWithPosts,
      yojnaPosts: yojnaData?.posts || [],
      carouselItems: carouselItems || [],
    };
  }
}
