const chai = require('chai')
let chaiHttp = require('chai-http')
chai.use(chaiHttp)

const expect = chai.expect
const TEST_API = "http://localhost:8000"

describe('Users routes', () => {

	it('assert success when uploading file with user xpto123', done => {
		chai.request(TEST_API)
		.post('/users')
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.field('Content-Type', 'multipart/form-data')
		.field('fileName', 'DonaldTrump_xpto123.csv')
		.attach('file', "../tmp/csv/DonaldTrump_xpto123.csv")
		.end((err, res) => {
			expect(res.statusCode).to.equal(201)
			done()
		})
	})

	it('assert success when uploading file with user xpto555', done => {
		chai.request(TEST_API)
		.post('/users')
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.field('Content-Type', 'multipart/form-data')
		.field('fileName', 'BarackObama_xpto555.csv')
		.attach('file', "../tmp/csv/BarackObama_xpto555.csv")
		.end((err, res) => {
			expect(res.statusCode).to.equal(201)
			done()
		})
	})
	
	it('assert that user with id xpto123 exists', done => {
		chai.request(TEST_API)
		.get("/users/xpto123/clients")
		.end((err, res) => {
			expect(res.statusCode).to.equal(200)
			done()
		})
	})

	it('assert that service return 404 when try to delete a nonexistent user', done => {
		chai.request(TEST_API)
		.delete("/users/xpto123213")
		.end((err, res) => {
			expect(res.statusCode).to.equal(404)
			done()
		})
	})

	it('assert that user with id xpto123 cannot update his id to xpto555', done => {
		chai.request(TEST_API)
		.put(`/users/xpto123`)
		.send({
			_id: "xpto555"
		})
		.end((err, res) => {
			expect(res.statusCode).to.equal(403)
			done()
		})
	})

	it('assert successfully updating name from user id xpto123', done => {
		chai.request(TEST_API)
		.put(`/users/xpto123`)
		.send({
			name: "New Donald Trump"
		})
		.end((err, res) => {
			expect(res.statusCode).to.equal(200)
			done()
		})
	})

	it('assert successfully deleting user with id xpto123', done => {
		chai.request(TEST_API)
		.delete(`/users/xpto123`)
		.end((err, res) => {
			expect(res.statusCode).to.equal(200)
			done()
		})
	})
})