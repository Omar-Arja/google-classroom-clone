pages.assignments = async() => {
    const index_url = pages.base_url + "send_assignment.php";
    
    document.getElementById("btn1").addEventListener("click", () => {
        const fileInput = document.getElementById('file-input');
        
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            
            reader.onload = () => {
                const fileData = reader.result;
                const fileName = file.name;
                
                alert(fileData);
                alert(fileName);               
                try {
                    const data = new FormData();
                    data.append("fileData", fileData)
                    data.append("fileName", fileName)
                    data.append("id_assignment", 1)
                    data.append("id_user", 1)
                
                alert(data)
                    fetch(index_url, {
                      method: "POST",
                      body: data
                    })
                  } catch (error) {
                    console.log(error)
                  }
                
               

            }
        }   
    
});
}


