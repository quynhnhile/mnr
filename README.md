# Domain-Driven Hexagon

## 1. Define model schema

- Tạo model mới trong thư mục `prisma/schema`.

- Chạy lệnh `npm run prisma:generate` để generate Prisma client.

- Chạy lệnh `npm run prisma:migrate:dev` để sync thay đổi vào trong database, câu lệnh migration tương ứng được sinh ra ở thư mục `prisma/migrations`.

- Copy nội dung file migration mới vào file `db-migration.sql` (internal use).

**Lưu ý:**

- Kiểm tra model kỹ lưỡng trước khi merge và migrate.

- Không sửa trực tiếp vào bất kỳ file migration nào, mọi thay đổi phải đi từ model trong thư mục `prisma/schema`.

## 2. Create module using CLI

### 2.1. Generate module

- Chạy lệnh `npm run module:generate`.

- Nhập tên module: số ít, vd: "user", "cargo type", ...

### 2.2. Update entity definitions

#### 2.2.1. Entity props

- Vào `domain/<module_name>.type.ts`, add props vào các interface có sẵn.

- Root props phải match với DB schema (required / optional).

#### 2.2.2. Errors

- Vào `domain/<module_name>.error.ts`, add các error tương ứng với nghiệp vụ.

### 2.3. Update mapper

- Vào `mappers/<module_name>.mapper.ts` để update.

### 2.4. Update DTOs

- Vào `dtos/<module_name>.response.dto.ts` để update. DTO này là cơ bản của một entity, bất kỳ use case nào trả về entity đều dùng DTO này.

- Các DTOs chuyên biệt cho từng use case sẽ định nghĩa ở trong thư mục của use case đó.

### 2.5. Update command logic

- Step 1. Vào `commands/<use_case>.command.ts` add các props cần thiết vào khai báo của command.

- Step 2. Add DTOs nếu cần thiết. Lưu ý: phân biệt rõ giữa null với undefined khi định nghĩa DTO props.

- Step 3: Vào `commands/<use_case>.service.ts` để update business logic. Lưu ý: Cần catch tất cả DB exception và ném ra domain exception tương ứng.

- Step 4: Vào `commands/<use)case>.http.controller.ts` để update logic. Lưu ý: Cần cactch tất cả domain exception, và ném ra HTTP exception tương ứng.

- Step 5: Update API docs. Kiểm tra DTOs, controllers đã có đủ các thông tin của API chưa? (request, success response, error response, ...)

## 3. IMPORTANT

### 3.1. Sử dụng đúng model

- Có 3 loại model, tham khảo ở mapper.ts của từng module.
  - Entity: dùng cho business layer (vd: `<model>.entity.ts`)
  - Model: dùng cho database layer (vd: `<model>.repository.prisma.ts`)
  - Response DTO: chỉ dùng khi response về client

### 3.2. Sử dụng đúng exception

- Tương tự model, có 3 loại exception:

  - Entity exception: Các exception gắn liền với business logic, được định nghĩa ở `<modules>/<module_name>/domain/<entity_name>.error.ts`
  - Database exception: Các exception liên quan đến database, được định nghĩa ở `@libs/ceptions/exceptions`
  - HTTP exception: Các exception dùng để response về client, dùng mặc định của `@nestjs/common`

- Vd: Use case `delete-user` với user không tồn tại trong hệ thống
  - DB repository ném lỗi `NotFoundException` (`@libs/ceptions/exceptions`) -> command handler.
  - Command handler nhận `NotFoundException` -> ném lỗi `UserNotFoundError` (`user.error.ts`) -> HTTP controller.
  - HTTP controller nhận `UserNotFoundError` -> response `NotFoundHttpException` (@nestjs/common) -> client (web/mobile)

## 4. Test API

- Step 1: Vào link bên dưới với account u: utest | p: 123
  <https://keycloak-ecm.cehcloud.net/realms/SNP/protocol/openid-connect/auth?client_id=MNR&redirect_uri=http://localhost:3000/callback&response_type=code&scope=openid>.
- Step 2: Copy giá trị `code` trong chuỗi bên dưới sau khi login ở step 1.
  `{"statusCode":404,"message":"Cannot GET /callback?session_state=68350509-4e10-46ce-ac21-fe4b9508101f&iss=http%3A%2F%2F10.10.11.200%3A8090%2Frealms%2FSNP&code=a70dc446-886d-4e33-b596-352e8595bdfe.68350509-4e10-46ce-ac21-fe4b9508101f.ab87a853-0206-485b-9c0a-45cbc9fa10b3","error":"Not Found"}`
- Step 3: npm start => <http://localhost:3000/docs>
- Step 4: Paste `code` step 3 vào API Exchange token (<http://localhost:3000/v1/auth/exchange-token>) => lấy access_token từ response
- Step 5: Paste token vào Authorize trên cùng bên phải Swagger

## 5. Calculate estimate tariff

- Input: `compCode`, `locCode`, `damCode`, `repCode`, `length`, `width`, `quantity`, `operationCode`

- Tìm `tariff` theo `compCode` and `repCode`, lấy `tariff.UNIT` để xác định cách tính

  - Nếu `ko có kết quả` => báo lỗi
  - Nếu tìm thấy `nhiều hơn 1 biểu cước` phù hợp => báo lỗi
  - Nếu tìm thấy `chỉ 1 kết quả` => tiếp tục

    - Nếu `tariff.UNIT` = "Q" => tính toán số lượng

      - Lấy **`laborRate`** từ tariff group (join từ `tariff` tùm được)
      - Nếu `tariff` ko có giá trị `add`

        - **`hours`** = `tariff.HOURS` \* `quantity` / `tariff.QUANTITY`
        - **`laborPrice`** = `hours` \* `laborRate`
        - **`matePrice`** = `tariff.MATE_AMOUNT` \* quantity / `tariff.QUANTITY`
        - **`currency`** = `tariff.CURRENCY`
        - **`total`** = `laborPrice` + `matePrice`
        - **`unit`** = `tariff.UNIT`
        - **`qty`** = `tariff.QUANTITY`

      - Nếu tariff có giá trị `add`

        - `hoursAdd` = (`quantity` - `tariff.QUANTITY`) \* `tariff.ADD_HOURS` / `tariff.ADD`
        - `matePriceAdd` = (`quantity` - `tariff.QUANTITY`) \* `tariff.MATE_AMOUNT` / `tariff.ADD`
        - **`hours`** = `hoursAdd` + `tariff.HOURS`
        - **`laborPrice`** = `hours` \* `laborRate`
        - **`matePrice`** = `tariff.MATE_AMOUNT` + `matePriceAdd`
        - **`total`** = `laborPrice` + `matePrice`
        - **`unit`** = `tariff.UNIT`
        - **`qty`** = `tariff.QUANTITY`

    - Nếu `tariff.UNIT` = "L" => tính toán độ dài

    - Nếu `tariff.UNIT` khác => tính toán diện tích

      - Square = length \* width
