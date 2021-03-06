import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Projet, UserId } from '../projet';
import { ConfirmDialogService } from '../Services/confirm-dialog.service';
import { ProjetService } from '../Services/projet.service';
import { User } from '../user';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';


@Component({
  selector: 'app-gestion-projets',
  templateUrl: './gestion-projets.component.html',
  styleUrls: ['./gestion-projets.component.css']
})
export class GestionProjetsComponent implements OnInit {
  projets:any;
  User: any;
  formValue !:FormGroup;
  showAdd:boolean=false;
  showDiv:boolean=false;
  showUpdate !:boolean;
  showAddCollaborator:boolean=false;
  projet:Projet=new Projet();
  userid:UserId=new UserId();
  idProject:any;
  idUser:any;
  email:any;
  Utilisateurs!:User[];


 


  constructor(private userService: UserService,private formBuilder:FormBuilder, private router :Router, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.formValue=this.formBuilder.group({
      nomProjet:[''],
      typeProjet:[''],
      chefProjet:[''],
      equipeProjet:[''],
      email:[''],
    })
    this.User = this.token.getUser();
    this.userService.getProjets(this.User.id).subscribe(data=>{this.projets=data;console.log(data);})
    
    
  }
  pass(id:string){
    this.userService.passProject(id);

  }
  clickMethod(name: string, id: string) {
    if(confirm("Are you sure to delete "+name)) {
      this.userService.deleteProjet(id);
      window.location.reload();
    }
  }
  getFiles(event:any) {
    console.log(event);
}
  addProject(){
    this.formValue.reset();
    this.showDiv=true;
    this.showAdd=true;
    this.showUpdate=false;
    this.showAddCollaborator=false;
  }
  addCollaborator(id:string){
    this.showDiv=true;
    this.showAdd=false;
    this.showUpdate=false;
    this.showAddCollaborator=true;
    this.idProject=id;
    this.userService.getMembresProj(this.idProject).subscribe(data=>{
    this.Utilisateurs=data;
    })
    console.log(this.idProject);
  }
  invitCollaborator(){
    console.log(this.idProject);
    this.email=this.formValue.value.email;
     console.log(this.email);
    this.userService.getIdbyEmail(this.formValue.value.email).subscribe(
      data=>{
        this.idUser=data
        console.log( this.idUser);
        console.log( this.idProject);
        this.userService.invitaion(this.idUser,this.idProject).subscribe(data=>
          {
            this.showDiv=false;
          }
            ) 
      }
    )

 
   
  }


  cancel(){
    this.showDiv=false;
  }
  getProjects(){
    this.userService.getProjets(this.User.id).subscribe(data=>{
      
    });
  }
  onEdit(projet:any){
    
    this.formValue.controls['nomProjet'].setValue(projet.nom);
    this.formValue.controls['typeProjet'].setValue("developpement web");
    this.showAdd=false;
    this.showUpdate=true;
    this.showDiv=true;
    this.showAddCollaborator=false;
    this.projet.id=projet.id;


  }
  updateProject(){
    this.userid.id=this.User.id;
    this.projet.user=[this.userid];
    this.projet.nom=this.formValue.value.nomProjet;
    this.projet.nom=this.formValue.value.nomProjet;
    this.userService.updateProjet(this.projet.id,this.projet).subscribe(data=>{
      alert("projet updated");
      let ref=document.getElementById('cancel');
       ref?.click();
     this.formValue.reset();

      this.getProjects();
      window.location.reload();
   
    });
  }
  saveProject(){
    this.userid.id=this.User.id;
    this.projet.nom=this.formValue.value.nomProjet;
    this.projet.user=[this.userid];
    console.log(this.projet);
    
    this.userService.addProjet(this.projet).subscribe(data=>{console.log(data)
    alert("projet added !")
    let ref=document.getElementById('cancel');
    ref?.click();
   
    window.location.reload();
  });
   

}
  
}