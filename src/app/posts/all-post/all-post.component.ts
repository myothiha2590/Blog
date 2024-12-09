import { Component,OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrl: './all-post.component.css'
})
export class AllPostComponent implements OnInit {

  postArray!:Array<any>;
  constructor(private postServce:PostsService,private router:Router){

  }

ngOnInit(): void {
      this.postServce.loadData().subscribe(val=>{
        this.postArray=val;
      })
}
onDeletePost(id:any,Img:any){
  if (confirm('Are you sure you want to delete this post?')) {
    this.postServce.deletePost(id, Img);
  }


}
onEdit(postId: string) {
  
  this.router.navigate(['/edit-post', postId]);
}

}
