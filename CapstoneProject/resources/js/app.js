
// login with google
window.handleCredentialResponse = function (response) {


    axios.post('/logingoogle', { payload: response.credential })
        .then(res => {
            if (res.data.success) {
                showToast(res.data.message, 'success');
                setTimeout(() => {
                    window.location.assign("/");
                }, 500);
            } else {
                showToast(res.data.message, 'fail');
            }
        })
        .catch(err => {
            showToast('Error ', 'fail');
            console.log(err);
        });
};







// cart functionalities
let axios = require('axios');

let addCartBtn = document.querySelectorAll('.add-cart-btn');


addCartBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        let product = JSON.parse(btn.dataset.product);


        axios.post('/cart/add', product)
            .then(res => {
                console.log(res.data);
                updateCartCounter(res.data.data.totalitems);
                showToast('Added to cart', 'success');
            })
            .catch(err => {
                showToast('Error ', 'fail');
                console.log(err);
            });
    });
})



// Register form

let registerForm = document.querySelector('#register-form');
if (registerForm)
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let name = registerForm['name'].value;
        let email = registerForm['email'].value;
        let password = registerForm['password'].value;

        let user = {
            name,
            email,
            password
        }


        if (name === '' || email === '' || password === '') {
            showToast('Please fill all fields', 'fail');
            return;
        }

        axios.post('/register', user)
            .then(res => {
                if (res.data.success) {
                    showToast(res.data.message, 'success');
                    registerForm.reset();
                    setTimeout(() => {
                        window.location.assign("/");
                    }, 1000);
                } else {
                    showToast(res.data.message, 'fail');
                }
            })
            .catch(err => {
                showToast('Error ', 'fail');
                console.log(err);
            });
    })




// Login form

let loginForm = document.querySelector('#login-form');
if (loginForm)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();


        let email = loginForm['email'].value;
        let password = loginForm['password'].value;

        let user = {
            email,
            password
        }


        if (email === '' || password === '') {
            showToast('Please fill all fields', 'fail');
            return;
        }

        axios.post('/login', user)
            .then(res => {
                if (res.data.success) {
                    showToast(res.data.message, 'success');
                    loginForm.reset();
                    setTimeout(() => {
                        window.location.assign("/");
                    }, 1000);
                } else {
                    showToast(res.data.message, 'fail');
                }
            })
            .catch(err => {
                showToast('Error ', 'fail');
                console.log(err);
            });
    })



// logout user

let logoutBtn = document.querySelector('#logout-user');
if (logoutBtn)
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();

        axios.post('/logout')
            .then(res => {
                if (res.data.success) {
                    showToast(res.data.message, 'success');
                    setTimeout(() => {
                        window.location.assign("/");
                    }, 1000);
                } else {
                    showToast(res.data.message, 'fail');
                }
            })
            .catch(err => {
                showToast('Error ', 'fail');
                console.log(err);
            });
    })





// place order
// let orderBtn = document.querySelector('#order-btn');
// if (orderBtn)
//     orderBtn.addEventListener('click', (e) => {
//         e.preventDefault();

//         let useraddress = document.querySelector('#user-address').value;
//         let usermobile = document.querySelector('#user-mobile').value;


//         let order = {
//             useraddress,
//             usermobile
//         }

//         if (useraddress === '' || usermobile === '') {
//             showToast('Please fill all fields', 'fail');
//             return;
//         }

//         axios.post('/order', order)

//             .then(res => {
//                 // showToast(res.data.message, 'success');
//             })
//             .catch(err => {
//                 console.log(err);
//                 showToast('Error ', 'fail');
//                 // window.location.assign("/orders");

//             });
// })



// hide success alert
let successAlert = document.querySelector('#order-alert');
if (successAlert) {
    setTimeout(() => {
        successAlert.remove();
    }
        , 2000);
}







// render admin orders
async function renderAdminOrders() {

    const adminTBody = document.querySelector('#admin-order-tbody');

    let orders = [];
    let adminTBodyHtml;


    axios.get('/admin/orders', { headers: { "X-Requested-With": "XMLHttpRequest" } })
        .then(res => {
            
            orders = res.data.orders;
            adminTBodyHtml = generateTbodyHtml(orders);
            adminTBody.innerHTML = adminTBodyHtml;
            // <div>${renderItems(order.items)}</div>
        })
        .catch(err => {
            console.log(err);
        });

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                    <p>${menuItem.cartproduct.productName} - ${menuItem.quantity} pcs </p>
                `
        }).join('')
    }

    function generateTbodyHtml(orders) {

        return orders.map(order => {
            return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p>${order._id}</p>
                    <div>${renderItems(order.products)}</div>
                </td>
                <td class="border px-4 py-2">${order.userId.name}</td>
                <td class="border px-4 py-2">${order.address}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${order._id}">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed"
                                    ${order.orderStatus === 'order_placed' ? 'selected' : ''}>
                                    Placed</option>
                                <option value="confirmed" ${order.orderStatus === 'confirmed' ? 'selected' : ''}>
                                    Confirmed</option>
                                <option value="prepared" ${order.orderStatus === 'prepared' ? 'selected' : ''}>
                                    Prepared</option>
                                <option value="delivered" ${order.orderStatus === 'delivered' ? 'selected' : ''}>
                                    Delivered
                                </option>
                                <option value="completed" ${order.orderStatus === 'completed' ? 'selected' : ''}>
                                    Completed
                                </option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                ${ moment(order.timestamp).format('hh:mm A') }
                </td>
                <td class="border px-4 py-2">
                ${ order.paymentType }
                </td>
            </tr>
        `
        }).join('')
    }









}
renderAdminOrders();






// utility functions

function updateCartCounter(count) {
    let cartCounterIcon = document.getElementById('cart-counter-icon');
    // let cartCounterIconValue = parseInt(cartCounterIcon.innerText);
    cartCounterIcon.innerText = count;
    cartCounterIcon.classList.add('animate__animated', 'animate__heartBeat');

    setTimeout(() => {
        cartCounterIcon.classList.remove('animate__animated', 'animate__heartBeat');
    }, 1000);
}

function showToast(val, type = 'success') {

    if (type === 'fail') {
        Toastify({
            text: `${val}   ❌`,
            duration: 2000,
            newWindow: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "white",
                color: "black",
            },
            onClick: function () { } // Callback after click
        }).showToast();
    } else {
        Toastify({
            text: `${val}  ✅`,
            duration: 2000,
            newWindow: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#E5E4E2",
                color: "black",
            },
            onClick: function () { } // Callback after click
        }).showToast();
    }

}