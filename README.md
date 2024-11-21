### Migrate UP
```bash
migrate -path migrations -database "postgresql://postgres:postgres@localhost/money_test?sslmode=disable" up
```