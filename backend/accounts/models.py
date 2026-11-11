"""Deliberately narrow request and response models; hashes never leave the API."""
import re
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, field_validator

Grade = Literal['K', '1', '2', '3', '4', '5']
Avatar = Literal['fox', 'owl', 'bear', 'bunny', 'cat', 'panda']


class Model(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)


class Credentials(Model):
    email: str = Field(max_length=254)
    password: str = Field(min_length=1, max_length=128)


class KidInput(Model):
    firstName: str = Field(min_length=1, max_length=40)
    grade: Grade
    avatarKey: Avatar

    @field_validator('firstName')
    @classmethod
    def valid_name(cls, value):
        name = value.strip()
        if not name or any(ord(char) < 32 for char in name):
            raise ValueError('Use a first name or nickname')
        return name


class KidView(KidInput):
    id: str


class PickerKid(Model):
    id: str
    firstName: str
    avatarKey: Avatar


class ProfilesView(Model):
    profiles: list[KidView]


class PickerView(Model):
    profiles: list[PickerKid]


class SessionView(Model):
    mode: Literal['picker', 'kid', 'parent']
    activeKidProfileId: str | None
    activeKid: KidView | None
    parentExpiresAt: float | None
    version: int


class ChooseKid(Model):
    profileId: str = Field(min_length=1, max_length=80)


class Pin(Model):
    pin: str = Field(min_length=4, max_length=6)

    @field_validator('pin')
    @classmethod
    def valid_pin(cls, value):
        if not re.fullmatch(r'[0-9]{4,6}', value):
            raise ValueError('Use a 4–6 digit PIN')
        return value


class NewPin(Pin):
    confirmPin: str = Field(min_length=4, max_length=6)


class SetupPin(NewPin):
    password: str = Field(min_length=1, max_length=128)


class ChangePin(NewPin):
    currentPin: str = Field(min_length=4, max_length=6)


class PasswordChange(Model):
    currentPassword: str = Field(min_length=1, max_length=128)
    newPassword: str = Field(min_length=1, max_length=128)


class GateView(Model):
    pinSetupRequired: bool
    lockedUntil: float | None


class CsrfView(Model):
    csrfToken: str


class OkView(Model):
    ok: bool = True


class SettingsView(Model):
    email: str


class Skill(Model):
    id: str
    name: str
    subject: Literal['math', 'ela']
    commonCoreCode: str
    status: Literal['gap', 'practicing', 'mastered', 'unassessed']


class Analytics(Model):
    sessionsThisWeek: int
    timeSpentMinutes: int
    problemsAttempted: int
    problemsCorrect: int


class ConversationSummary(Model):
    id: str
    title: str
    startedAt: float
    preview: str


class DashboardView(Model):
    profile: KidView
    sample: bool = True
    skills: list[Skill]
    analytics: Analytics
    conversations: list[ConversationSummary]


class Message(Model):
    role: Literal['student', 'sidekick']
    text: str
    timestamp: float


class ConversationView(Model):
    id: str
    title: str
    startedAt: float
    sample: bool = True
    messages: list[Message]
