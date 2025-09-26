import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CmsService } from '../../services/cms.service';
import { LOCAL_VARS } from '../../config/local/consts';

interface User {
  id: string;
  name: string;
  email: string;
  profile: 'admin' | 'user';
}

@Component({
  selector: 'lib-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [CmsService],
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss']
})
export class CmsComponent implements OnInit {
  cmsService = inject(CmsService);
  currentUser: User = this.getAdminUser()

  users: User[] = [];

  ngOnInit() {
    this.loadUsers();
  }

  getAdminUser(){
    let currentUser;
    if(LOCAL_VARS.isLocalhost){
      const stored = localStorage.getItem(LOCAL_VARS.STORAGE_KEY);
      currentUser =  stored ? JSON.parse(stored) : null;
    }
    return currentUser  
  }

  loadUsers() {
    this.cmsService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  addUser() {
    // Implement add user logic
    console.log('Add user clicked');
  }

  editUser(user: User) {
    // Implement edit user logic
    console.log('Edit user:', user);
  }

  deleteUser(id: string) {
    // Implement delete user logic
    console.log('Delete user:', id);
  }
}