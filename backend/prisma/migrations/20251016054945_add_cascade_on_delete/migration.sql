-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."course_plans" DROP CONSTRAINT "course_plans_course_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."course_reviews" DROP CONSTRAINT "course_reviews_course_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."course_reviews" DROP CONSTRAINT "course_reviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."course_videos" DROP CONSTRAINT "course_videos_course_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."enrollments" DROP CONSTRAINT "enrollments_course_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."enrollments" DROP CONSTRAINT "enrollments_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."enrollments" DROP CONSTRAINT "enrollments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."mock_attempts" DROP CONSTRAINT "mock_attempts_test_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."mock_attempts" DROP CONSTRAINT "mock_attempts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."mock_questions" DROP CONSTRAINT "mock_questions_test_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."mock_series" DROP CONSTRAINT "mock_series_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."mock_series_tags" DROP CONSTRAINT "mock_series_tags_series_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."mock_series_tags" DROP CONSTRAINT "mock_series_tags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."mock_series_tests" DROP CONSTRAINT "mock_series_tests_series_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."mock_series_tests" DROP CONSTRAINT "mock_series_tests_test_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_course_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_mock_series_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_tags" DROP CONSTRAINT "post_tags_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_tags" DROP CONSTRAINT "post_tags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_template_id_fkey";

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_plans" ADD CONSTRAINT "course_plans_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_videos" ADD CONSTRAINT "course_videos_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "course_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_attempts" ADD CONSTRAINT "mock_attempts_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "mock_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_attempts" ADD CONSTRAINT "mock_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_series_tags" ADD CONSTRAINT "mock_series_tags_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "mock_series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_series_tags" ADD CONSTRAINT "mock_series_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "mock_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_questions" ADD CONSTRAINT "mock_questions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "mock_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_series" ADD CONSTRAINT "mock_series_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "mock_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_series_tests" ADD CONSTRAINT "mock_series_tests_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "mock_series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_series_tests" ADD CONSTRAINT "mock_series_tests_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "mock_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_mock_series_id_fkey" FOREIGN KEY ("mock_series_id") REFERENCES "mock_series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "post_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
