import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CmsService } from '../../services/cms.service';
import { DEV_ENV } from '../../config/injection-tokens/api.base.injection.token';
import { HeaderComponent } from '../../components/header/header.component';
import { TodoListConfig } from '../../interfaces/personalization.interface';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../interfaces/user.interface';
import { take } from 'rxjs';
import { ConfigmapService } from '../../services/configmap.service';
import { ConfigMap } from '../../interfaces/configmap.interface';


@Component({
  selector: 'lib-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, HeaderComponent, FormsModule],
  providers: [CmsService, ConfigmapService],
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CmsComponent implements OnInit {
  cmsService = inject(CmsService);
  configmapService = inject(ConfigmapService);
  
  currentUser: User = this.getAdminUser()
  users: User[] = [];
  config: TodoListConfig = {
    showFilters: true,
    canAddTasks: true,
    canEditTasks: true,
    canRemoveTasks: true
  };
  isAddingUser = false;
  edit: boolean = false;
  newUser: User = this.getEmptyUser();
  successMessage: string = '';

  private getEmptyUser(): User {
    return {
      id: '',
      name: '',
      email: '',
      profile: 'user'
    };
  }

  ngOnInit() {
    this.loadUsers();
    this.loadConfig();
  }

  private loadConfig(): void {
    this.configmapService.getConfig().subscribe({
      next: (config: ConfigMap) => {
        if (config?.todoList) {
          this.config = {
            showFilters: config.todoList.showFilters ?? true,
            canAddTasks: config.todoList.canAddTasks ?? true,
            canEditTasks: config.todoList.canEditTasks ?? true,
            canRemoveTasks: config.todoList.canRemoveTasks ?? true
          };
        }
      },
      error: (err) => console.error('Error loading config:', err)
    });
  }

  saveConfig(): void {
    const configUpdate = {
      todoList: {
        showFilters: this.config.showFilters,
        canAddTasks: this.config.canAddTasks,
        canEditTasks: this.config.canEditTasks,
        canRemoveTasks: this.config.canRemoveTasks
      }
    };

    this.configmapService.updateConfig(configUpdate)
      .pipe(take(1))
      .subscribe({
        next: () => {
          console.log('configuração salva com sucesso');
          this.successMessage = 'Configuração salva com sucesso!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Erro ao salvar configuração:', err);
        }
      });
  }

  getAdminUser() {
    let currentUser;
    if (DEV_ENV.isLocalhost) {
      const stored = localStorage.getItem(DEV_ENV.STORAGE_KEY);
      currentUser = stored ? JSON.parse(stored) : null;
    }
    return currentUser
  }

  loadUsers() {
    this.cmsService.getUsers().subscribe(users => {
      this.users = users;
    });
  }


  editUser(userEdit: User, edit: boolean): void {
    const user = this.users.find(u => u.id === userEdit.id);
    if (user) {
      this.newUser = { ...user };
      this.isAddingUser = true;
      this.edit = true;
    }
  }

  deleteUser(id: string): void {
    this.cmsService.deleteUser(id)
      .pipe(take(1))
      .subscribe(() => {
        this.users = this.users.filter(user => user.id !== id);
      });
  }

  showAddForm(): void {
    this.isAddingUser = true;
    this.newUser = this.getEmptyUser();
  }

  cancelAdd(): void {
    this.isAddingUser = false;
    this.newUser = this.getEmptyUser();
  }

  editItem(form: NgForm): void {
    console.log('Editando item:', this.newUser);
    this.cmsService.editUser(this.newUser.id, this.newUser as User)
      .pipe(take(1))
      .subscribe(() => {
        this.users = this.users.map(user =>
          user.id === this.newUser.id ? { ...user, ...this.newUser } : user
        );
        this.isAddingUser = false;
        this.edit = false;
        this.newUser = this.getEmptyUser();
        form.resetForm(this.getEmptyUser());
      });
  }

  addUser(form: NgForm): void {

     if (DEV_ENV.isLocalhost && !this.edit) {
      this.newUser.id = String(Math.floor(Math.random() * 10000));
    }
    if (!form.valid) return;

    this.cmsService.addUser(this.newUser).subscribe({
      next: (user) => {
        this.users.unshift(user);
        this.isAddingUser = false;
        this.newUser = this.getEmptyUser();
        form.resetForm(this.getEmptyUser());
      },
      error: (err) => console.error('Erro ao adicionar usuário:', err)
    });
  }
}