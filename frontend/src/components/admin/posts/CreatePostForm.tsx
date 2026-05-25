"use client" // Added "use client" as this is a client component

import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditor } from 'tinymce';

import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import {Select, SelectItem} from "@heroui/select"; // Fixed import
import { Checkbox } from "@heroui/checkbox";
import type { Post } from "@/pages/admin/posts";
import type { Category, PostTemplate, Tag } from "@/pages/admin/posts/new";
import { form } from "@heroui/theme";

interface CreatePostFormProps {
  initialData?: Post;
  templates: PostTemplate[];
  categories: Category[];
  tags: Tag[];
}

export function CreatePostForm({ initialData, templates, categories, tags }: CreatePostFormProps) {
  const { token } = useAuth();
  const router = useRouter();
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const isEditMode = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState<string | undefined>(initialData?.category_id?.toString());
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || "");
  const [metaKeywords, setMetaKeywords] = useState(initialData?.meta_keywords || "");
  
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    new Set(initialData?.post_tags?.map((pt: { tag_id: number }) => pt.tag_id.toString()) || [])
  );
  const [templateId, setTemplateId] = useState<string>(initialData?.template_id?.toString() || "");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [initialContent, setInitialContent] = useState(initialData?.content_html || "");

  // Corrected handler to get value from event
  const handleTemplateChange = (value: string) => {
    const template = templates.find(t => t.id.toString() === value);
    setTemplateId(value);
    if (template && editorRef.current) {
        editorRef.current.setContent(template.structure);
    }
  };

  const handleTagChange = (tagId: string) => {
    setSelectedTags(prev => {
        const newSet = new Set(prev);
        newSet.has(tagId) ? newSet.delete(tagId) : newSet.add(tagId);
        return newSet;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const authToken = token || undefined;
    e.preventDefault();
    if (!editorRef.current) {
        setError("Category and content are required.");
        return;
    }
    setIsLoading(true);
    setError(null);
    
    const finalContentHtml = editorRef.current.getContent();
    
    const formData = new FormData();
    
    formData.append('title', title);
    formData.append('slug', slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''));
    if (categoryId) {
      formData.append('category_id', categoryId);
    } else {
      formData.append('category_id', ''); // Send empty if not selected
    }
    formData.append('content_html', finalContentHtml);
    
    if (templateId) {
        formData.append('template_id', templateId);
    }
    
    // Always send tags field, even if empty (for update operations)
    const tagsString = Array.from(selectedTags).join(',');
    formData.append('tags', tagsString);
    
    if (metaTitle) formData.append('meta_title', metaTitle);
    if (metaDescription) formData.append('meta_description', metaDescription);
    if (metaKeywords) formData.append('meta_keywords', metaKeywords);
    
    if (thumbnailFile) {
        formData.append('file', thumbnailFile);
    }

    try {
      if (isEditMode) {
        await api.putFormData(`/posts/${initialData.id}`, formData, authToken);
      } else {
        await api.postFormData('/posts', formData, authToken);
      }
      router.push('/admin/posts');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save post.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-col items-start">
              {/* Added some default styling to h1/p */}
              <h1 className="text-lg font-semibold">Post Content</h1>
              <p className="text-sm text-gray-500">Load a template and then edit the content visually.</p>
            </CardHeader>
            <CardBody>
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={initialContent}
                init={{
                  height: 700,
                  menubar: true,
                  plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
                  toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                  content_style: 'body { font-family:Poppins,sans-serif; font-size:16px }'
                }}
              />
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Settings</h2>
            </CardHeader>
            {/* FIX: Changed CardContent to CardBody */}
            <CardBody className="space-y-4">
              <div className="space-y-2">
                {/* --- TEMPLATE SELECT FIX --- */}
                <Select 
                  label="Load Template" 
                  placeholder="Load a template..."
                  value={templateId}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                >
                  {templates.map(template => (
                    <SelectItem key={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Input id="post-title" label="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Input id="post-slug" label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated-from-title" />
              </div>
              <div className="space-y-2">
                {/* --- CATEGORY SELECT FIX --- */}
                <Select 
                  label="Category" 
                  placeholder="Choose a category..."
                  selectedKeys={categoryId ? [categoryId] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    setCategoryId(selected ? String(selected) : undefined);
                  }}
                  required
                >
                  {categories.map(category => (
                    <SelectItem key={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Meta Information</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              
              <div className="space-y-2">
                <Input id="thumbnail-file" label="Thumbnail Image" type="file" onChange={handleFileChange} accept="image/*" />
                {!thumbnailFile && initialData?.thumbnail_url && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Current thumbnail:</p>
                    <img src={initialData.thumbnail_url} alt="Current thumbnail" className="w-32 h-32 object-cover rounded-md border" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Input id="meta-title" label="Meta Title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="SEO-friendly title" />
              </div>

              <div className="space-y-2">
                <Textarea id="meta-description" label="Meta Description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="SEO-friendly description for search results" />
              </div>

              <div className="space-y-2">
                <Textarea id="meta-keywords" label="Meta Keyword" value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} placeholder="comma, separated, keywords" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Tags</h2>
            </CardHeader>
            <CardBody className="space-y-2 max-h-48 overflow-y-auto">
              {tags.map(tag => (
                // --- CHECKBOX & LABEL FIX ---
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`tag-${tag.id}`}
                    isSelected={selectedTags.has(tag.id.toString())} // Use 'isSelected'
                    onChange={() => handleTagChange(tag.id.toString())} // Use 'onChange'
                  />
                  {/* Use a standard HTML label */}
                  <label 
                    htmlFor={`tag-${tag.id}`} 
                    className="text-sm cursor-pointer select-none"
                  >
                    {tag.name}
                  </label>
                </div>
              ))}
            </CardBody>
          </Card>

          <Button type="submit" disabled={isLoading} className="w-full text-lg bg-[#7828C8] text-white">
            {isLoading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Publish Post')}
          </Button>
          {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
        </div>
      </div>
    </form>
  );
}