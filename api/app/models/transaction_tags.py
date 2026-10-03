from sqlalchemy import Table, Column, String, ForeignKey
from app.database import Base

transaction_tags = Table(
    'transaction_tags',
    Base.metadata,
    Column('transaction_id', String, ForeignKey('transactions.id'), primary_key=True),
    Column('tag_id', String, ForeignKey('tags.id'), primary_key=True)
)
