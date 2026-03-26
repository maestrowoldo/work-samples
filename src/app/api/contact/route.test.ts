import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreate, mockDisconnect, mockSendContactEmail } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockDisconnect: vi.fn(),
  mockSendContactEmail: vi.fn(),
}));

vi.mock("@prisma/client", () => ({
  PrismaClient: class PrismaClientMock {
    contact = {
      create: mockCreate,
    };

    $disconnect = mockDisconnect;
  },
}));

vi.mock("@/lib/email", () => ({
  sendContactEmail: mockSendContactEmail,
}));

import { POST } from "./route";

describe("POST /api/contact", () => {
  beforeEach(() => {
    mockCreate.mockReset();
    mockDisconnect.mockReset();
    mockSendContactEmail.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when the payload is invalid", async () => {
    const response = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: "Al",
          email: "invalido",
          mensagem: "curta",
        }),
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toContain("Dados inválidos");
    expect(body.issues).toBeInstanceOf(Array);
    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockSendContactEmail).not.toHaveBeenCalled();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it("stores the contact and returns success when email sending succeeds", async () => {
    mockCreate.mockResolvedValue({ id: 1 });
    mockSendContactEmail.mockResolvedValue(true);

    const payload = {
      nome: "Wolkendo Arias",
      email: "woldobest@gmail.com",
      celular: "11999999999",
      mensagem: "Gostaria de conversar sobre um projeto full stack.",
    };

    const response = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toContain("Mensagem recebida com sucesso");
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        nome: payload.nome,
        email: payload.email,
        celular: payload.celular,
        mensagem: payload.mensagem,
        status: "novo",
      },
    });
    expect(mockSendContactEmail).toHaveBeenCalledWith(
      payload.nome,
      payload.email,
      payload.mensagem,
      payload.celular,
    );
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it("returns success even when email delivery fails after saving", async () => {
    mockCreate.mockResolvedValue({ id: 1 });
    mockSendContactEmail.mockResolvedValue(false);

    const response = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: "Wolkendo Arias",
          email: "woldobest@gmail.com",
          mensagem: "Mensagem suficientemente longa para passar na validação.",
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockSendContactEmail).toHaveBeenCalledTimes(1);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it("returns 500 when the database write fails", async () => {
    mockCreate.mockRejectedValue(new Error("database unavailable"));

    const response = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: "Wolkendo Arias",
          email: "woldobest@gmail.com",
          mensagem: "Mensagem suficientemente longa para passar na validação.",
        }),
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.message).toContain("Erro ao enviar mensagem");
    expect(mockSendContactEmail).not.toHaveBeenCalled();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
