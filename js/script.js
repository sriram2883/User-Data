var changeData;
window.onload = function(){
    var userPlus = document.getElementById("addUser");
    var addModal = document.getElementById("modalAddUser");
    
    userPlus.addEventListener("click", () => {
        addModal.classList.add("show");
        addModal.style.display = "block";
    })
    
    window.addEventListener("click", (event)=> {
        if (event.target == addModal) {
          addModal.style.display = "none";
        }
    });
    fetchUsers();
};

function fetchUsers(){
    var main=document.getElementById("table")
    main.innerHTML=``
    main.innerHTML=`<tr id="tableHeadings">
    <th class="name">Name</th>
    <th class="age">Age</th>
    <th class="state">State</th>
    <th class="functions">Functions</th>
</tr>`
    var req = new XMLHttpRequest();
    req.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200){
            var data=JSON.parse(this.responseText);
            data.forEach((user)=>{
                var tag=document.createElement("tr");
                tag.id=user.id;
                tag.innerHTML=`<td>${user.name}</td><td>${user.age}</td><td>${user.state}</td><td class="functions">
                <button class="edit" onclick="editUser(${user.id});" type="button" id=${user.id}><i class="fa-solid fa-pen-clip"></i></button><button class="deleteB" onclick="deleteUser(${user.id},'${(user.name)}');" type="button" id=${user.id}><i class="fa-solid fa-trash-can"></i></button>
            </td>`;
                main.appendChild(tag)
            });
            console.log(data);
        }
    };
    req.open("GET","https://65f729c3b4f842e80885385b.mockapi.io/sriramusers/users",true);
    req.send();
}
function editUser(id){
    var userPlus = document.getElementById("editUser");
    var addModal = document.getElementById("modalEditUser");
    addModal.classList.add("show");
    addModal.style.display = "block";
    window.addEventListener("click", (event)=> {
        if (event.target == addModal) {
          addModal.style.display = "none";
        }
    });
    var edit = new XMLHttpRequest()
    edit.onreadystatechange=function(){
        if(edit.status==200 && edit.readyState==4){
            var data=JSON.parse(this.responseText);
            document.getElementById("editName").value=data.name;
            document.getElementById("editAge").value=data.age;
            document.getElementById("editState").value=data.state;     
        }
    }
    edit.open("GET","https://65f729c3b4f842e80885385b.mockapi.io/sriramusers/users/"+id,true)
    edit.send()
    changeData=function(){
        var change = new XMLHttpRequest();
        change.onreadystatechange=function(){
            if(this.readyState==4 && this.status==200){
                alert("data changed!")
                fetchUsers();
                addModal.style.display = "none";
                
            }
        }
        var name=document.getElementById("editName").value;
        var age=document.getElementById("editAge").value;
        var state=document.getElementById("editState").value;
        change.open("PUT","https://65f729c3b4f842e80885385b.mockapi.io/sriramusers/users/"+id,true);
        change.setRequestHeader("content-type","application/json");
        change.send(JSON.stringify({"name": name,"age": age,"state": state}));    }
}

function deleteUser(id,name){
    document.getElementById("userDeleted").textContent=name;
    var modal = document.getElementById("deleteModal");
    modal.classList.add("show");
    modal.style.display = "block";
    var del = new XMLHttpRequest();
    var cancelDelete=document.querySelectorAll(".deleteCancel");
    cancelDelete.forEach((btn)=>{
        btn.addEventListener("click", ()=>{
            modal.style.display = "none";
            del.open("DELETE","https://65f729c3b4f842e80885385b.mockapi.io/sriramusers/users/-1");
            del.send();
            window.location.reload()
        });


    });
    var confirmDelete = document.querySelector(".confirmDelete");
    confirmDelete.addEventListener("click", ()=>{
        del.onreadystatechange= function (){
            if(this.status==200 && this.readyState==4){
                window.location.reload();
            }
        }
        console.log("https://65f729c3b4f842e80885385b.mockapi.io/sriramusers/users/"+String(id))
        del.open("DELETE","https://65f729c3b4f842e80885385b.mockapi.io/sriramusers/users/"+id,true);
        del.send()
        modal.style.display = "none";
    });
}
function addUser(){
    var add=new XMLHttpRequest();
    var addModal = document.getElementById("modalAddUser");
    var name=document.getElementById("inputName").value;
    var age=document.getElementById("inputAge").value;
    var state=document.getElementById("inputState").value;
    if(name && age && state){
    add.open("POST","https://65f729c3b4f842e80885385b.mockapi.io/sriramusers/users",true)
    add.setRequestHeader("content-type","application/json");
    add.onreadystatechange=function(){
        if(this.readyState==4 && this.status==201){
            fetchUsers();
            alert("added successfully");
            addModal.style.display = "none";
            document.getElementById("inputName").value="";
            document.getElementById("inputAge").value="";
            document.getElementById("inputState").value="State";

        }
    }
    add.send(JSON.stringify({"name": name,"age": age,"state": state}));
}
    else{
        alert("Enter data properly!");
    }
}