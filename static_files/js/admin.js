var first=-1;
function radioSelect(flag){
    const container = document.getElementById('moviecont');
        if (first!=flag){    
            first=flag;
        
        container.innerHTML = '';
        container.style.display = 'block';
        container.style.height = '100%';
        console.log(flag);
            // Create form element
            const form = document.createElement('form');
            form.action = '/admin/upload';
            form.method = 'POST';
            form.enctype = 'multipart/form-data';

            // Create labels and text inputs
            var labels,inputIds;
            if(flag==0){
                labels = ['Enter movie name:', 'Enter genre:', 'Enter movie description:', 'Enter movie cast:', 'Enter movie type:'];
                inputIds = ['mname', 'mgenre', 'mdesc', 'mcast', 'mty'];
            }
            else{
                 labels = ['Enter series name:', 'Enter genre:', 'Enter series description:', 'Enter series cast:', 'Enter series type:', 'How many parts in this series?'];
                 inputIds = ['sname', 'sgenre', 'sdesc', 'scast', 'sty','sparts'];
            }
            for (let i = 0; i < labels.length; i++) {
                var p = document.createElement('p');

                var label = document.createElement('label');
                label.textContent = labels[i];
                label.htmlFor = inputIds[i];
                label.classList.add('form-label');

                var input = document.createElement('input');
                input.type = 'text';
                input.id = inputIds[i];
                input.name = inputIds[i];
                input.classList.add('form-control');

                p.appendChild(label);
                p.appendChild(input);
                form.appendChild(p);
            }
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'flag';
                hiddenInput.value = flag;
                form.appendChild(hiddenInput);


            // Create file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.name = 'videoFile';
            fileInput.accept = 'video/mp4';

            // Create submit button
            const submitBtn = document.createElement('button');
            submitBtn.type = 'submit';
            submitBtn.textContent = 'Upload';
            submitBtn.id = 'sendButton';

            // Append file input and submit button to form
            form.appendChild(fileInput);
            form.appendChild(submitBtn);

            submitBtn.addEventListener('click', function(event) {
                if (!fileInput.files.length) {
                    event.preventDefault(); // Prevent the form from submitting
                    alert("Please select a file to upload.");
                    return;
                }
            });

            // Append form to container
            container.appendChild(form);

        }
        else{
            container.style.display = 'none';
        }
    }


    async function deleteSeries(recordId, database) {
        const confirmDelete = confirm(`Are you sure you want to delete this ${database} record?`);
        if (confirmDelete) {
            try {
                const response = await fetch(`/admin/delete/${recordId}?database=${database}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    window.location.reload(); // Refresh page after successful deletion
                } else {
                    console.error('Delete request failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting record:', error);
            }
        }
    }

    