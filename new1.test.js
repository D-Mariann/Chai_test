const expect = require('chai').expect
const app = require('./service/demo_service')
let users = require('../demo')


describe('demo', () => {
    describe('users/:id', () => {
        it("Has a user info by id", async () => {      
            let r = await app.get("users/1");
            expect(r).to.have.property('status', 200);

            const res = await r.json();         
            expect(res.user.id).equal(1);
            expect(res.user.name).equal('John');
            expect(res.user.balance).equal(100.0);
        });
        it('Return a 404 if invalid user id', async () => {
            let r = await app.get("users/2");
            expect(r).to.have.property('statusText', 'Not Found');
            expect(r).to.have.property('status', 404);
            const res = await r.json();            
            expect(res.status).equal('not found');            
        });
    });

    describe('users', function() {
        it('Registering a new user', async function() {
            const res = await app.post('users', { name: 'Alice' });            
            const data = await res.json();
            expect(data.status).to.equal('ok');
            expect(data.user).to.deep.equal({ id: 2, name: 'Alice', balance: 0.0 });
        });              
           
        it('Registering a new user2', async function() {
            const res = await app.post('users', { name: 'Gena' });            
            expect(res.status).equal(200);
            const data = await res.json();
            expect(data.status).equal('ok');
            expect(data.user.name).equal('Gena');
            expect(data.user.id).equal(3);
            expect(data.user.balance).equal(0);
        });   
    });

    describe('/users/:id/buy/:price', function() {
        it('User makes a purchase worth the price', async function() {
            let id = 1;
            let price = 10;
            let sale = {id: id, price: price};
            const res = await app.post(`users/${id}/buy/${price}`, sale);
            let idx = users.users[id-1].id;
            let nameU = users.users[id-1].name;
            let bal = users.users[id-1].balance;
            expect(res.status).to.equal(200);
            const data = await res.json();            
            expect(data.user).to.deep.equal({ id: idx, name: nameU, balance: bal });
        });   

        it('User not found', async function() {
            let id = 9;
            let price = 10;
            let sale = {id: id, price: price}
            const res = await app.post(`users/${id}/buy/${price}`, sale);
            expect(res.status).to.equal(200);
            const data = await res.json();                        
            expect(data).to.deep.equal({ status: 'error', text: 'user not found' });
        });   
        
        it('User has not enough money', async function() {
            let id = 2;
            let price = 10;
            let sale = {id: id, price: price};
            const res = await app.post(`users/${id}/buy/${price}`, sale);
            expect(res.status).to.equal(200);
            const data = await res.json();                
            expect(data).to.deep.equal({ status: 'error', text: 'not enough money' });
        });   
    });


    describe('/users/:id/faucet/:amount', function() {                
        it('Give the user money for free', async function() {
            let id = 1;
            let amount = 10;
            let gift = {id: id, amount: amount}
            const res = await app.post(`users/${id}/faucet/${amount}`, gift);
            let idx = users.users[id-1].id;
            let nameU = users.users[id-1].name;
            let bal = users.users[id-1].balance;
            expect(res.status).to.equal(200);
            const data = await res.json();
            expect(data.status).equal('ok');
            expect(data.user).to.deep.equal({ id: idx, name: nameU, balance: bal });
        }); 

        it('User not found', async function() {
            let id = 7
            let amount = 10;
            let gift = {id: id, amount: amount};
            const res = await app.post(`users/${id}/faucet/${amount}`, gift);
            expect(res.status).to.equal(200);        
            const data = await res.json();                      
            expect(data).to.deep.equal({ status: 'error', text: 'user not found' });
        });     
    });

});

