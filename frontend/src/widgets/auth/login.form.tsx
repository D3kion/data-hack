import { useNavigate } from "react-router";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/shared/ui-kit";
import { useAuth } from "@/entities/auth";

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  function onLogin() {
    login();
    navigate("/", { replace: true });
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Вход в систему</CardTitle>
        <CardDescription>
          Введите ваши учетные данные, чтобы продолжить
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="manager@dh.io"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="manager"
              required
            />
          </div>
          <Button type="submit" className="w-full" onClick={onLogin}>
            Войти
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
