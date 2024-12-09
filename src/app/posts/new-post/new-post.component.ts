// // import { Component, OnInit } from '@angular/core';
// // import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// // import { CategoriesService } from '../../services/categories.service';
// // import { Post } from '../../models/post';
// // @Component({
// //   selector: 'app-new-post',
// //   templateUrl: './new-post.component.html',
// //   styleUrls: ['./new-post.component.css']
// // })
// // export class NewPostComponent implements OnInit {
// //   permalink: string = '';
// //   imgSrc: any='assets'
// //   selectedImg: any;
// //   categories:Array<any>=[];
// //   postForm: FormGroup;

// //   constructor(private categoriesService: CategoriesService, private formBuilder: FormBuilder) {
// //     this.postForm = this.formBuilder.group({
// //       title: ['', [Validators.required, Validators.minLength(10)]],
// //       permalink: ['', Validators.required],
// //       excerpt: ['', [Validators.required, Validators.minLength(50)]],
// //       category: ['', Validators.required],
// //       postImg: ['', Validators.required],
// //       content: ['', Validators.required],
// //     })
// //   }

// //   ngOnInit(): void {
// //     this.categoriesService.loadData().subscribe(val=>{this.categories=val;

// //     })
// //   }
// //   get fc() {
// //     return this.postForm.controls;
// //   }

// //   onTitleChanged($event: any) {
// //     const title = $event.target.value;
// //     this.permalink =  title.replace(/\s/g, '-');
// //   }
// //   showPreview($event: any) {
// //     const reader = new FileReader();
// //     reader.onload = (e) => {
// //       this.imgSrc = e.target?.result;
// //     }
// //     reader.readAsDataURL($event.target.files[0]);
// //     this.selectedImg = $event.target.files[0];
// //   }
// // }
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CategoriesService } from '../../services/categories.service';
// import { Post } from '../../models/post';
// import { Title } from '@angular/platform-browser';
// import { title } from 'process';
// import { PostsService } from '../../services/posts.service';
// import { ActivatedRoute, Router } from '@angular/router';

// import { ToastrService } from 'ngx-toastr';
// import { error } from 'console';

// @Component({
//   selector: 'app-new-post',
//   templateUrl: './new-post.component.html',
//   styleUrls: ['./new-post.component.css'],
// })
// export class NewPostComponent implements OnInit {
//   permalink: string = '';
//   imgSrc: any = '/assets/placeholder.jpg';
//   selectedImg: any;
//   categories: Array<any> = [];
//   postForm: FormGroup;
//   postId: string | null = null;
//   isEditMode: boolean = false;
//   constructor(
//     private categoriesService: CategoriesService,
//     private router: Router,
//     private route: ActivatedRoute,
//     private postService: PostsService,
//     private formBuilder: FormBuilder,
//     private toastr: ToastrService
//   ) {
//     this.postForm = this.formBuilder.group({
//       title: ['', [Validators.required, Validators.minLength(10)]],
//       permalink: ['', Validators.required],
//       excerpt: ['', [Validators.required, Validators.minLength(50)]],
//       category: ['', Validators.required],
//       postImg: ['', Validators.required],
//       content: ['', Validators.required],
//     });
//   }
//   ngOnInit(): void {
//     this.categoriesService.loadData().subscribe((val) => {
//       this.categories = val;
//     });

//     this.postId = this.route.snapshot.paramMap.get('id');
//     if (this.postId) {
//       this.isEditMode = true;
//       this.postService.getPost(this.postId).subscribe((post) => {
//         this.postForm.patchValue({
//           title: post.title,
//           permalink: post.permalink,
//           excerpt: post.excerpt,
//           category: `${post.category.categoryId}-${post.category.category}`,
//           content: post.content,
//         });
//         this.imgSrc = post.postImgPath;
//       });
//     }
//   }
//   get fc() {
//     return this.postForm.controls;
//   }
//   onTitleChanged($event: any) {
//     const title = $event.target.value;
//     this.permalink = title.replace(/\s/g, '-');
//   }
//   showPreview($event: any) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       this.imgSrc = e.target?.result;
//     };
//     reader.readAsDataURL($event.target.files[0]);
//     this.selectedImg = $event.target.files[0];
//   }
//   onSubmit() {
//     let splitted = this.postForm.value.category.split('-');
//     const postData: Post = {
//       title: this.postForm.value.title,
//       permalink: this.postForm.value.permalink,
//       category: {
//         categoryId: splitted[0],
//         category: splitted[1],
//       },
//       postImgPath: '',
//       excerpt: this.postForm.value.excerpt,
//       content: this.postForm.value.content,
//     };
//     if (this.isEditMode) {
//       this.postService
//         .updateData(this.postId!, postData)
//         .then(() => {
//           this.toastr.success('Post updated successfully!');
//           this.router.navigate(['/posts']);
//         })
//         .catch((error) => {
//           this.toastr.error('Update is erroring');
//           console.error('Update error:', error);
//         });
//     } else {
//       this.postService.uploadImage(this.selectedImg, postData);
//       this.postForm.reset();
//       this.imgSrc = '/assets/placeholder.jpg';
//     }

//     this.postService.uploadImage(this.selectedImg, postData);
//     this.postForm.reset();
//     this.imgSrc = '/assets/placeholder.jpg';
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { Post } from '../../models/post';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../services/posts.service';
@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  permalink: string = '';
  imgSrc: any = './assets/placeholder-image.png';
  selectedImg: any;
  categories: Array<any> = [];
  postForm!: FormGroup;
  post: any;
  formStatus: string = 'Add New';
  docId!: string;
  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private postService: PostsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((val) => {
      this.docId = val.id;
      if (this.docId) {
        this.postService.loadOneData(val.id).subscribe((post) => {
          this.post = post;
          this.postForm = this.formBuilder.group({
            title: [
              this.post.title,
              [Validators.required, Validators.minLength(10)],
            ],
            permalink: [this.post.permalink, Validators.required],
            excerpt: [
              this.post.excerpt,
              [Validators.required, Validators.minLength(50)],
            ],
            category: [
              `${this.post.category.categoryId}-${this.post.category.category}`,
              Validators.required,
            ],
            postImg: ['', Validators.required],
            content: [this.post.content, Validators.required],
          });
          this.imgSrc = this.post.postImgPath;
          this.formStatus = 'Edit';
        });
      } else {
        this.postForm = this.formBuilder.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: ['', Validators.required],
          excerpt: ['', [Validators.required, Validators.minLength(50)]],
          category: ['', Validators.required],
          postImg: ['', Validators.required],
          content: ['', Validators.required],
        });
      }
    });
  }
  ngOnInit(): void {
    this.categoriesService.loadData().subscribe((val) => {
      this.categories = val;
    });
  }
  get fc() {
    return this.postForm.controls;
  }
  onTitleChanged($event: any) {
    const title = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');
  }
  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    };
    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }
  onSubmit() {
    let splitted = this.postForm.value.category.split('-');
    console.log(splitted);
    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: splitted[0],
        category: splitted[1],
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
    };
    this.postService.uploadImage(
      this.selectedImg,
      postData,
      this.formStatus,
      this.docId
    );
    this.postForm.reset();
    this.imgSrc = './assets/placeholder-image.png';
  }
}
