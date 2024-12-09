import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { promises } from 'dns';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private storage:AngularFireStorage,
    private afs:AngularFirestore,
    private toastr:ToastrService,
    private router:Router,
  ) { }

  uploadImage(selectedImage: any, postData: any, formStatus: string, docId: string){
    const filePath=`postIMG/${Date.now()}`;
    this.storage.upload(filePath,selectedImage).then(()=>{
      console.log('Post image uploaded successfully!');

      this.storage.ref(filePath).getDownloadURL().subscribe(URL=>{
        postData.postImgPath = URL;
        this.saveData(postData);
      })
    })
  }
  getPost(postId: string): Observable<any> {
    return this.afs.collection('posts').doc(postId).valueChanges();
  }

  saveData(postData:any){
    this.afs.collection('posts').add(postData).then(docRef=>{
      this.toastr.success('Data Inserted Successfully!');
      this.router.navigate(['/posts']);
    })
  }
  updateData(id: any, postData: any) {
    this.afs.doc(`posts/${id}`).update(postData).then(()=> {
      this.toastr.success('Data Updated Successfully!');
      this.router.navigate(['/posts']);
    })
  }
  deleteImage(postImgPath: any, id: any) {
    this.storage.storage.refFromURL(postImgPath).delete().then(() => {
      this.deleteData(id);
    })
  }
  deleteData(id: any) {
    this.afs.doc(`posts/${id}`).delete().then(() => {
      this.toastr.warning('Data Deleted...!');
    })
  }







  //   return this.afs.doc(`posts/${id}`).update(postData).then(() => {
  //     this.toastr.success('Data Updated Successfully!');
  //     this.router.navigate(['/posts']);
  //   });
  // }
  // updatePost(id: string, postData: any): Promise<void> {
  //   return this.afs.collection('posts').doc(id).update(postData);
  // }
  
  loadData(){
    return this.afs.collection('posts').snapshotChanges().pipe(
      map(actions=>{
      return actions.map(a=>{
        const data=a.payload.doc.data();
        const id=a.payload.doc.id;
        return {id,data};
      })
    })
  )
  }
  loadOneData(id:any){
    return this.afs.collection('posts').doc(id).valueChanges();
  }
  deletePost(id: string, postImgPath: string) {
    this.storage.storage.refFromURL(postImgPath).delete().then(() => {
      this.afs.collection('posts').doc(id).delete().then(() => {
        this.toastr.success('Post Deleted Successfully!');
      });
    });
  }
  // updateData(id: any, postData: any) {
  //   this.afs.doc(`posts/${id}`).update(postData).then(()=> {
  //     this.toastr.success('Data Updated Successfully!');
  //     this.router.navigate(['/posts']);
  //   })
  // }
 






  
}
